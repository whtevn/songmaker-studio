/**
 * @file storeMaker.test.js
 *
 * Demonstrates how to test:
 * 1. An entity without any modules (basic CRUD store slice).
 * 2. An entity using hasMany (add/remove children).
 * 3. Orderable children (move child to index, etc.).
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { create } from 'zustand'
// If you use zustand/persist, import persist too, e.g.:
// import { persist } from 'zustand/middleware'

import { defineStore, mergeStores } from '~/storeMaker'
import { hasMany, supabase } from '~/storeMaker/modules'

// -----------------------
// 1. Minimal store model
// -----------------------

// Example: An entity with *no* modules
const BasicEntity = defineStore({
  type: 'BasicEntity',
  default: {
    title: 'Untitled BasicEntity',
  },
  backend: {
    toBackend: (entity) => ({ ...entity }),
    fromBackend: (raw) => ({ ...raw }),
  },
})

// --------------------------
// 2. hasMany store model
// --------------------------
const ChildEntity = defineStore({
  type: 'ChildEntity',
  default: {
    name: 'Untitled Child',
  },
  // No hasMany usage here, purely a child type
})

const ParentEntity = defineStore({
  type: 'ParentEntity',
  default: {
    title: 'Untitled Parent',
  },
  has_many: [
    {
      type: 'ChildEntity',
      on: 'childEntities',
      orderable: true, // for reorder tests
    },
  ],
})
  .withModule(hasMany)
  // You can also chain supabase if needed:
  // .withModule(supabase)

// ----------------------------------------------
// 3. Build test store with mergeStores & zustand
// ----------------------------------------------
let useTestStore

describe('storeMaker Tests', () => {
  // Re-initialize the store before each test to get a fresh state.
  beforeEach(() => {
    // For demonstration, we'll create a store with two slices:
    //   1) BasicEntity slice (no modules)
    //   2) ParentEntity slice (with hasMany -> ChildEntity)
    useTestStore = create((set, get) => ({
      ...mergeStores({ set, get }, BasicEntity, ParentEntity, ChildEntity),
    }))
  })

  // ---------------------------------------
  // Test: Basic entity (no modules)
  // ---------------------------------------
  describe('BasicEntity (no modules)', () => {
    it('should initialize an array slice for BasicEntity', () => {
      const state = useTestStore.getState()
      // The store is typically shaped like: { BasicEntity: [], ParentEntity: [], ChildEntity: [] } etc.
      // Depending on how mergeStores structures them, confirm the default shape:
      expect(Array.isArray(state.BasicEntity)).toBe(true)
      expect(state.BasicEntity).toHaveLength(0)
    })

    it('should provide CRUD methods (create, update, delete) for BasicEntity', () => {
      const state = useTestStore.getState()

      // Create
      // The exact method might be something like state.createBasicEntity,
      // or BasicEntity.create, or something else depending on your implementation.
      // Adjust to whatever your code actually generates:
      const created = state.createBasicEntity({
        title: 'My First Entity',
      })

      // Check the store
      expect(state.BasicEntity).toHaveLength(1)
      expect(state.BasicEntity[0].title).toBe('My First Entity')
      expect(created.localId).toBeDefined() // ensure we have an ID

      // Update
      const updated = state.updateBasicEntity(created.localId, {
        title: 'My Updated Entity',
      })
      expect(updated.title).toBe('My Updated Entity')

      // Delete
      state.deleteBasicEntity(created.localId)
      expect(state.BasicEntity).toHaveLength(0)
    })
  })

  // ---------------------------------------
  // Test: ParentEntity with hasMany
  // ---------------------------------------
  describe('ParentEntity + hasMany (ChildEntity)', () => {
    it('should initialize an array slice for ParentEntity and ChildEntity', () => {
      const { ParentEntity, ChildEntity } = useTestStore.getState()
      expect(Array.isArray(ParentEntity)).toBe(true)
      expect(ParentEntity).toHaveLength(0)

      expect(Array.isArray(ChildEntity)).toBe(true)
      expect(ChildEntity).toHaveLength(0)
    })

    it('should allow creating a ParentEntity, and adding children to it', () => {
      const state = useTestStore.getState()

      // Create a parent
      const parent = state.createParentEntity({
        title: 'Parent #1',
      })
      expect(parent.localId).toBeDefined()
      expect(state.ParentEntity).toHaveLength(1)

      // Create some children
      const child1 = state.createChildEntity({ name: 'Child #1' })
      const child2 = state.createChildEntity({ name: 'Child #2' })

      // Add child1 and child2 to parent
      // The generated method might be something like:
      //   parent.addChildEntity(child1.localId) 
      // or a store-level function like:
      //   state.addChildEntityToParentEntity(parent.localId, child1.localId)
      // It depends on how your code is structured. Example:
      state.addChildToParentEntity(parent.localId, child1.localId)
      state.addChildToParentEntity(parent.localId, child2.localId)

      // Confirm parent -> child relationship in store
      const updatedParent = state.getParentEntity(parent.localId)
      // Typically you'd see something like updatedParent.childEntities = [child1.localId, child2.localId]
      // or an array of fully populated child objects (depending on your design).
      expect(updatedParent.childEntities).toContain(child1.localId)
      expect(updatedParent.childEntities).toContain(child2.localId)
    })

    it('should remove children from the parent', () => {
      const state = useTestStore.getState()

      const parent = state.createParentEntity({ title: 'Parent #2' })
      const child1 = state.createChildEntity({ name: 'Child #1' })
      const child2 = state.createChildEntity({ name: 'Child #2' })

      state.addChildToParentEntity(parent.localId, child1.localId)
      state.addChildToParentEntity(parent.localId, child2.localId)

      // Now remove child2
      state.removeChildFromParentEntity(parent.localId, child2.localId)

      const updatedParent = state.getParentEntity(parent.localId)
      expect(updatedParent.childEntities).toContain(child1.localId)
      expect(updatedParent.childEntities).not.toContain(child2.localId)
    })

    it('should reorder children (orderable items)', () => {
      const state = useTestStore.getState()

      const parent = state.createParentEntity({ title: 'Parent #3' })
      const childA = state.createChildEntity({ name: 'A' })
      const childB = state.createChildEntity({ name: 'B' })
      const childC = state.createChildEntity({ name: 'C' })

      // Add them in [A, B, C]
      state.addChildToParentEntity(parent.localId, childA.localId)
      state.addChildToParentEntity(parent.localId, childB.localId)
      state.addChildToParentEntity(parent.localId, childC.localId)

      // Let's say we want to move childC to index 1 (between A and B)
      // The store might provide something like:
      //    state.moveChildInParentEntity(parent.localId, childC.localId, 1)
      // Or "parent.moveChildToIndex(childC.localId, 1)" etc.
      state.moveChildInParentEntity(parent.localId, childC.localId, 1)

      const updatedParent = state.getParentEntity(parent.localId)
      // We expect the order now to be: A, C, B
      expect(updatedParent.childEntities[0]).toBe(childA.localId)
      expect(updatedParent.childEntities[1]).toBe(childC.localId)
      expect(updatedParent.childEntities[2]).toBe(childB.localId)
    })
  })
})

