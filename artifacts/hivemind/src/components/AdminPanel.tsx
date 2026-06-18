import { useState, useEffect } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Lock, Save, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { data, updateData } = useAdminData();
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-admin', handleOpen);
    return () => window.removeEventListener('open-admin', handleOpen);
  }, []);

  // Sync internal form state if global context updates from elsewhere
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hivemind2024") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleSave = () => {
    updateData(formData);
    setIsOpen(false);
  };

  const handleReset = () => {
    localStorage.removeItem("hivemind_admin_data");
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-950 border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5" /> HiveMind Admin
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
              {!isAuthenticated ? (
                <form onSubmit={handleLogin} className="space-y-4 mt-20">
                  <div className="space-y-2 text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <Lock className="w-8 h-8 text-neutral-400" />
                    </div>
                    <p className="text-neutral-400">Enter administrator password</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black border-white/10 text-white"
                    />
                    {error && <p className="text-sm text-red-400">{error}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200">
                    Authenticate
                  </Button>
                </form>
              ) : (
                <div className="space-y-8">
                  
                  {/* Hero Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Hero Section</h3>
                    <div className="space-y-2">
                      <Label className="text-neutral-400">Headline</Label>
                      <Input 
                        value={formData.hero.headline}
                        onChange={(e) => setFormData({...formData, hero: {...formData.hero, headline: e.target.value}})}
                        className="bg-black border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-400">Subheadline</Label>
                      <Textarea 
                        value={formData.hero.subheadline}
                        onChange={(e) => setFormData({...formData, hero: {...formData.hero, subheadline: e.target.value}})}
                        className="bg-black border-white/10 text-white min-h-[100px]"
                      />
                    </div>
                  </div>

                  {/* Owner Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Owner Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-neutral-400">Name</Label>
                        <Input 
                          value={formData.owner.name}
                          onChange={(e) => setFormData({...formData, owner: {...formData.owner, name: e.target.value}})}
                          className="bg-black border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-neutral-400">Title</Label>
                        <Input 
                          value={formData.owner.title}
                          onChange={(e) => setFormData({...formData, owner: {...formData.owner, title: e.target.value}})}
                          className="bg-black border-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-400">Bio</Label>
                      <Textarea 
                        value={formData.owner.bio}
                        onChange={(e) => setFormData({...formData, owner: {...formData.owner, bio: e.target.value}})}
                        className="bg-black border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Monthly Pricing ($)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-neutral-400">Starter</Label>
                        <Input 
                          type="number"
                          value={formData.pricing.starter}
                          onChange={(e) => setFormData({...formData, pricing: {...formData.pricing, starter: parseInt(e.target.value) || 0}})}
                          className="bg-black border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-neutral-400">Pro</Label>
                        <Input 
                          type="number"
                          value={formData.pricing.professional}
                          onChange={(e) => setFormData({...formData, pricing: {...formData.pricing, professional: parseInt(e.target.value) || 0}})}
                          className="bg-black border-white/10 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-neutral-400">Business</Label>
                        <Input 
                          type="number"
                          value={formData.pricing.business}
                          onChange={(e) => setFormData({...formData, pricing: {...formData.pricing, business: parseInt(e.target.value) || 0}})}
                          className="bg-black border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Contact Links</h3>
                    <div className="space-y-2">
                      <Label className="text-neutral-400">Email</Label>
                      <Input 
                        value={formData.contact.email}
                        onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})}
                        className="bg-black border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-400">Discord User</Label>
                      <Input 
                        value={formData.contact.discord}
                        onChange={(e) => setFormData({...formData, contact: {...formData.contact, discord: e.target.value}})}
                        className="bg-black border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-neutral-400">WhatsApp</Label>
                      <Input 
                        value={formData.contact.whatsapp}
                        onChange={(e) => setFormData({...formData, contact: {...formData.contact, whatsapp: e.target.value}})}
                        className="bg-black border-white/10 text-white"
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="p-6 border-t border-white/10 flex gap-4 bg-black/50">
                <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button className="flex-1 bg-white text-black hover:bg-neutral-200" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
