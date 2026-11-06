import { Link } from 'react-router-dom';
import { useCircleLinks } from './useCircleVariantData.js';

/*
 * CirclePersonLink — a router link to a person's profile that stays inside the audience's Community
 * (`/community/people/:id` for talent, `/recruiter/community/people/:id` for recruiters). Props: id (person id) + any <Link> attribute.
 */
const CirclePersonLink = ({ id, ...rest }) => {
  const { personHref } = useCircleLinks();
  return <Link to={personHref(id)} {...rest} />;
};

export default CirclePersonLink;
