import { withAuth } from "@entities/user";

export const getServerSideProps = withAuth();

const style = {
  height: "100vh",
  width: "100vw",
  backgroundColor: "#f4f4f4",
  outline: "1px solid #000",
};
export default function About() {
  return (
    <main>
      <div style={style}>About</div>
      <div style={style}>About</div>
      <div style={style}>About</div>
      <div style={style}>About</div>
      <div style={style}>About</div>
      <div style={style}>About</div>
      <div style={style}>About</div>
      <div style={style}>About</div>
      <div style={style}>About</div>
    </main>
  );
}
