import type { Route } from "./+types/home";
import { Dashboard } from "../pages/dashboard";
import Page from '../components/studio-layout/page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Song Maker Studio" },
    { name: "description", content: "Accessible Music Theory" },
  ];
}

export default function DashboardPage() {
  return <Page><Dashboard /></Page>;
}

