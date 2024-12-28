import type { Route } from "./+types/home";
import LyricWizard from "../../pages/lyricWizard";
import Page from '../../components/studio-layout/page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Song Maker Studio" },
    { name: "description", content: "Accessible Music Theory" },
  ];
}

export default function LyricWizardPage() {
  return <Page>
          <LyricWizard />
         </Page>;
}



