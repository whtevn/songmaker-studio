/**
 * @file storeMaker.test.js
 *
 * Demonstrates how to test:
 * 1. An entity without any modules (basic CRUD store slice).
 * 2. An entity using hasMany (add/remove children).
 * 3. Orderable children (move child to index, etc.).
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'

import { defineStore, mergeStores } from '~/storeMaker'
import { hasMany, supabase } from '~/storeMaker/modules'


// -----------------------
// 1. Minimal store model
// -----------------------
const BasicEntity = defineStore({
  type: 'BasicEntity',
  default: {
    title: 'Untitled BasicEntity',
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
})

const ParentEntity = defineStore({
  type: 'ParentEntity',
  default: {
    title: 'Untitled Parent',
  },
  has_many: [
    {
      type: 'ChildEntity',
      on: 'childEntitys',
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
let state = ()=>useTestStore.getState()
describe('storeMaker Tests', () => {
  // Re-initialize the store before each test to get a fresh state.
  beforeEach(() => {
    useTestStore = create((set, get) => ({
      ...mergeStores({ set, get }, BasicEntity, ParentEntity, ChildEntity),
    }))
  })

  // ---------------------------------------
  // Test: Basic entity (no modules)
  // ---------------------------------------
  describe('BasicEntity (no modules)', () => {
    it('should initialize an array slice for BasicEntity', () => {
      expect(Array.isArray(state().basicEntitys)).toBe(true)
      expect(state().basicEntitys).toHaveLength(0)
    })

    it('should provide CRUD methods (add, update, delete) for BasicEntity', () => {

      // Create a new BasicEntity instance
      const created = new BasicEntity({ title: 'My First Entity' })
      // Add it to the store
      state().addBasicEntity(created)

      let updateState = useTestStore.getState()
      expect(updateState.basicEntitys).toHaveLength(1)
      expect(updateState.basicEntitys[0].title).toBe('My First Entity')
      expect(updateState.basicEntitys[0].localId).toBeDefined()

      // Update the entity in the store
      state().updateBasicEntity({
        localId: created.localId,
        title: 'My Updated Entity',
      })

      updateState = useTestStore.getState()
      expect(updateState.basicEntitys[0].title).toBe('My Updated Entity')

      // Delete the entity from the store
      state().deleteBasicEntity({localId: created.localId})
      expect(state().basicEntitys).toHaveLength(0)
    })
  })

  // ---------------------------------------
  // Test: ParentEntity with hasMany
  // ---------------------------------------
  describe('ParentEntity + hasMany (ChildEntity)', () => {
    it('should initialize an array slice for ParentEntity and ChildEntity', () => {
      const { parentEntitys, childEntitys } = useTestStore.getState()
      expect(Array.isArray(parentEntitys)).toBe(true)
      expect(parentEntitys).toHaveLength(0)

      expect(Array.isArray(childEntitys)).toBe(true)
      expect(childEntitys).toHaveLength(0)
    })

    it('should allow creating a ParentEntity, and adding children to it', () => {

      // Create a new parent
      const parent = new ParentEntity({ title: 'Parent #1' })
      // Add parent to the store
      state().addParentEntity(parent)

      expect(parent.localId).toBeDefined()
      expect(state().parentEntitys).toHaveLength(1)
      expect(state().getParentEntity({localId: parent.localId})).toBeDefined()

      // Create children via the store
      const child1 = new ChildEntity({ name: 'Child #1' })
      const child2 = new ChildEntity({ name: 'Child #2' })

      // Add them to the parent
      state().addChildEntityToParentEntity(parent, child1)

      let children = state().getParentEntity({localId: parent.localId}).childEntitys 
      expect(children).toHaveLength(1)
      expect(children[0].localId).toBe(child1.localId)

      state().addChildEntityToParentEntity(parent, child2)
      children = state().getParentEntity({localId: parent.localId}).childEntitys 

      expect(children).toHaveLength(2)
      expect(children[1].localId).toBe(child2.localId)

      expect(state().childEntitys).toHaveLength(2)
    })

    it('should remove children from the parent', () => {

      // Create and add parent
      const parent = new ParentEntity({ title: 'Parent #2' })
      state().addParentEntity(parent)

      // Create children
      const child1 = new ChildEntity({ name: 'Child #1' })
      const child2 = new ChildEntity({ name: 'Child #2' })

      // Add children to the parent
      state().addChildEntityToParentEntity(parent, child1)
      state().addChildEntityToParentEntity(parent, child2)

      // Now remove child2
      state().removeChildEntityFromParentEntity(parent, child2)

      const updatedParent = state().getParentEntity({localId: parent.localId})
      expect(updatedParent.childEntitys.map(e => e.localId)).toContain(child1.localId)
      expect(updatedParent.childEntitys).not.toContain(child2.localId)
    })

    it('should reorder children (orderable items)', () => {
      const state = useTestStore.getState()

      // Create and add parent
      const parent = new ParentEntity({ title: 'Parent #3' })
      state.addParentEntity(parent)

      const childA = new ChildEntity({ name: 'A' })
      const childB = new ChildEntity({ name: 'B' })
      const childC = new ChildEntity({ name: 'C' })

      // Add them in [A, B, C]
      state.addChildEntityToParentEntity(parent, childA)
      state.addChildEntityToParentEntity(parent, childB)
      state.addChildEntityToParentEntity(parent, childC)

      // Move childC to index 1 (between A and B)
      state.moveChildEntityToIndexOnParentEntity(parent, childC, 1)

      const updatedParent = state.getParentEntity({localId: parent.localId})
      // We expect the order now to be: A, C, B
      expect(updatedParent.childEntitys[0].localId).toBe(childA.localId)
      expect(updatedParent.childEntitys[1].localId).toBe(childC.localId)
      expect(updatedParent.childEntitys[2].localId).toBe(childB.localId)
    })
  })
})

