import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        go to dashbaord
      </Button>
      <h1>Home page</h1>
    </div>
  );
};
