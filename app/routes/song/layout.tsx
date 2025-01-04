import type { Route } from "./+types/home";
import SongWizard from "~/pages/songWizard";
import Page from '~/components/studio-layout/page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Song Maker Studio" },
    { name: "description", content: "Accessible Music Theory" },
  ];
}

export default function SongWizardPage() {
  return <Page>
          <SongWizard />
        </Page>;
}


