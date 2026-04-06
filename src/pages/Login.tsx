import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import coupleImg from "@/assets/couple.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      login(data.token, data.username);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-card overflow-hidden border-2 border-border"
      >
        <div className="bg-primary/10 p-8 text-center border-b border-border">
          <img src={coupleImg} alt="" className="w-24 h-24 mx-auto mb-4 animate-float" />
          <h1 className="font-display text-3xl font-bold text-foreground">Couple Planner</h1>
          <p className="font-handwritten text-muted-foreground text-lg mt-2">Log in to your shared space</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-1 block">Couple Name (Username)</label>
              <Input 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. AliceBob"
                className="bg-input/50"
                required
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-1 block">Password</label>
              <Input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-input/50"
                required
              />
            </div>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full font-bold font-body text-md py-6 rounded-xl hover:scale-[1.02] transition-transform">
            {loading ? "Logging in..." : <><LogIn className="mr-2" size={20} /> Login</>}
          </Button>

          <p className="text-center font-body text-sm text-muted-foreground pt-2">
            Don't have a shared space yet? <Link to="/register" className="text-primary hover:underline font-bold">Register</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
