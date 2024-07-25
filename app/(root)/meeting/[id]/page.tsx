import React, { FC } from "react";
interface MeetingProps {
  params: { id: string };
}
const Meeting: FC<MeetingProps> = ({ params }) => {
  const { id } = params;
  return <div>Meeting :{id}</div>;
};

export default Meeting;
