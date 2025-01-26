import type { Route } from "./+types/home";
import SongWizard from "~/pages/songWizard/songWizardPage";
import Page from '~/components/common/page';

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


