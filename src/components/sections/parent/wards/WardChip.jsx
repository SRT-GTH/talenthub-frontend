import StatusPill from '../../../ui/StatusPill.jsx';

/*
 * WardChip — the status pill of the ward screens. Now a thin wrapper over the shared `ui/StatusPill` (same props: tone 'active' | 'pending' | 'opted', children), kept so the
 * ward, flags and link builders keep one import.
 */
const WardChip = (props) => <StatusPill {...props} />;

export default WardChip;
