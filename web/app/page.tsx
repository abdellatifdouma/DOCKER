import bodyHtml from './bodyHtml';
import Scripts from '../components/Scripts';

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <Scripts />
    </>
  );
}
