import type { Route } from "./+types/home";
import KeyFinder from "~/pages/keyFinder";
import Page from '~/components/studio-layout/page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Song Maker Studio" },
    { name: "description", content: "Accessible Music Theory" },
  ];
}

export default function KeyFinderPage() {
  return <Page>
          <KeyFinder />
        </Page>;
}


