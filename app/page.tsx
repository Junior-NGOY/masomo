import Home, { metadata as homeMetadata } from "./(front)/page";
import FontLayout from "./(front)/layout";

export const metadata = homeMetadata;

export default function Page() {
  return (
    <FontLayout>
      <Home />
    </FontLayout>
  );
}
