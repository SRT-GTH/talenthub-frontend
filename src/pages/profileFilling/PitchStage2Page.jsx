import PitchStage2Section from '../../components/sections/profileFilling/PitchStage2Section.jsx';

/*
 * PitchStage2Page — route endpoint for /profile/filling/pitch/record.
 * Named `/record` rather than `/list` because Pitch is a single-item mode
 * switcher (record / upload / write), not a CRUD list like the sibling
 * stages — see PitchStage2Section.jsx's own header for the full reasoning.
 */
const PitchStage2Page = () => <PitchStage2Section />;

export default PitchStage2Page;
