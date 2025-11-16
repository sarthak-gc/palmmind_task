import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axios } from "@/utils/axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/signup", {
        username,
        password,
      });
      if (res.data.status == "success") {
        toast.success(res.data.message);
      }

      localStorage.setItem("userId", res.data.data?.user?.id);
      localStorage.setItem("username", res.data.data?.user?.username);
      localStorage.setItem("token", res.data.data?.token);
      navigate("/dashboard/global");
    } catch (err) {
      console.error(err);
      // @ts-expect-error err
      toast.error(err.response.data.message);
      // @ts-expect-error err
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 p-6">
        <h2 className="text-2xl mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Sign up
          </Button>
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black underline font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
