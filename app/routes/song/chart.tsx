import type { Route } from "./+types/home";
import SongWizard from "~/pages/songWizard";
import Page from '~/components/common/page';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Song Maker Studio" },
    { name: "description", content: "Accessible Music Theory" },
  ];
}

export default function SongChartPage() {
  return <Page>
          <h1>HELLO</h1>
        </Page>;
}


