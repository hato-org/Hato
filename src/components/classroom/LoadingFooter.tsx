import Loading from '../common/Loading';

export default function Footer({
  context,
}: {
  context?: { loadMore: null; loading: boolean } | undefined;
}) {
  return context?.loading ? <Loading /> : null;
}
