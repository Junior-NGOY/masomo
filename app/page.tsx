import Home, { metadata as homeMetadata } from "./(marketing)/page";
import FontLayout from "./(marketing)/layout";

export const metadata = homeMetadata;

export default function Page() {
  return (
    <FontLayout>
      <Home />
    </FontLayout>
  );
}
