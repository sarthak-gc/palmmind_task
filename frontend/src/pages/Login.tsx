import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axios } from "@/utils/axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        username,
        password,
      });

      if (res.data.status == "success") {
        toast.success(res.data.message);
      }

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("username", res.data.data?.user?.username);
      localStorage.setItem("userId", res.data.data.user.id);
      navigate("/dashboard/global");
    } catch (err) {
      // @ts-expect-error type unknown
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96 p-6">
        <h2 className="text-2xl mb-4 text-center">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
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
            Log In
          </Button>
          <p className="text-center text-gray-400 mt-6">
            Dont have an account?{" "}
            <Link
              to="/signup"
              className="text-black underline font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
