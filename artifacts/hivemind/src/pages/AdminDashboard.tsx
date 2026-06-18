import { useState, useEffect } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import type { AdminData, ServiceData, ProjectData, TestimonialData, PricingData } from "@/context/AdminDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, Save, RefreshCw, LogOut, Plus, Trash2, Edit2, FileImage } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const TABS = ["Branding", "Founder", "Services", "Projects", "Testimonials", "Pricing", "Contact", "SEO"];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Branding");
  const [isSaving, setIsSaving] = useState(false);
  
  const { data, updateData } = useAdminData();
  const [formData, setFormData] = useState<AdminData>(data);

  // Service Editor State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);

  // Project Editor State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Testimonial Editor State
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // Pricing Editor State
  const [editingPricingId, setEditingPricingId] = useState<string | null>(null);
  const [isAddingPricing, setIsAddingPricing] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("hivemind_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hivemind2024") {
      setIsAuthenticated(true);
      sessionStorage.setItem("hivemind_admin_auth", "true");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("hivemind_admin_auth");
    setIsAuthenticated(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      updateData(formData);
      toast.success("Changes saved successfully!");
    } catch (e) {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data to defaults? This cannot be undone.")) {
      localStorage.removeItem("hivemind-admin-data");
      window.location.reload();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-panel p-8 rounded-3xl text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Lock className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Access</h1>
          <p className="text-muted-foreground mb-8">Enter password to access dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/20"
            />
            {error && <p className="text-sm text-destructive text-left">{error}</p>}
            <Button type="submit" className="w-full">
              Enter Admin
            </Button>
          </form>
          <div className="mt-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">← Back to Site</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-card border-r md:h-screen flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Lock className="w-4 h-4" /> Hivemind AI Admin
          </h2>
        </div>
        <div className="flex flex-row md:flex-col p-4 gap-2 overflow-x-auto flex-nowrap md:overflow-y-auto flex-1">
          {TABS.map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              className="justify-start whitespace-nowrap"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className="p-4 border-t mt-auto flex flex-col gap-2">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              ← View Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-6 border-b bg-card flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold">{activeTab}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={isSaving}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-4xl mx-auto space-y-8 pb-24">
            
            {activeTab === "Branding" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Brand Name</Label>
                    <Input value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-4 border p-4 rounded-lg">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    {formData.logoDataUrl ? (
                      <img src={formData.logoDataUrl} alt="Logo" className="h-12 object-contain bg-neutral-800 p-2 rounded" />
                    ) : (
                      <div className="h-12 w-32 bg-neutral-800 rounded flex items-center justify-center text-xs text-neutral-500">No Logo</div>
                    )}
                    <Input type="file" accept=".png,.svg,.webp" onChange={(e) => handleFileUpload(e, 'logoDataUrl')} />
                    {formData.logoDataUrl && <Button variant="destructive" size="sm" onClick={() => setFormData({...formData, logoDataUrl: null})}>Remove</Button>}
                  </div>
                </div>

                <div className="space-y-4 border p-4 rounded-lg">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4">
                    {formData.faviconDataUrl ? (
                      <img src={formData.faviconDataUrl} alt="Favicon" className="w-8 h-8 object-contain bg-neutral-800 p-1 rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center text-xs text-neutral-500">None</div>
                    )}
                    <Input type="file" accept=".png,.svg,.ico" onChange={(e) => handleFileUpload(e, 'faviconDataUrl')} />
                    {formData.faviconDataUrl && <Button variant="destructive" size="sm" onClick={() => setFormData({...formData, faviconDataUrl: null})}>Remove</Button>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Founder" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Founder Name</Label>
                    <Input value={formData.founderName} onChange={e => setFormData({...formData, founderName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={formData.founderTitle} onChange={e => setFormData({...formData, founderTitle: e.target.value})} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Tagline</Label>
                    <Input value={formData.founderTagline} onChange={e => setFormData({...formData, founderTagline: e.target.value})} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Bio</Label>
                    <Textarea value={formData.founderBio} onChange={e => setFormData({...formData, founderBio: e.target.value})} className="h-32" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Years Exp.</Label>
                    <Input value={formData.founderYears} onChange={e => setFormData({...formData, founderYears: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Projects</Label>
                    <Input value={formData.founderProjects} onChange={e => setFormData({...formData, founderProjects: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Clients</Label>
                    <Input value={formData.founderClients} onChange={e => setFormData({...formData, founderClients: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4 border p-4 rounded-lg">
                  <Label>Avatar Image</Label>
                  <div className="flex items-center gap-4">
                    {formData.founderAvatarUrl ? (
                      <img src={formData.founderAvatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center text-xs text-neutral-500">None</div>
                    )}
                    <Input type="file" accept=".png,.jpg,.jpeg,.webp" onChange={(e) => handleFileUpload(e, 'founderAvatarUrl')} />
                    {formData.founderAvatarUrl && <Button variant="destructive" size="sm" onClick={() => setFormData({...formData, founderAvatarUrl: null})}>Remove</Button>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Services" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Services</h3>
                  <Button onClick={() => setIsAddingService(true)} disabled={isAddingService}>
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                  </Button>
                </div>

                <div className="space-y-4">
                  {(isAddingService ? [{ id: "new", name: "", description: "", icon: "Globe", price: "0", features: [] }, ...formData.services] : formData.services).map(service => {
                    const isEditing = editingServiceId === service.id || (isAddingService && service.id === "new");
                    
                    if (isEditing) {
                      return (
                        <div key={service.id} className="border p-4 rounded-lg space-y-4 bg-card/50">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input 
                                defaultValue={service.name} 
                                id={`service-name-${service.id}`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Price (Starting at)</Label>
                              <Input 
                                defaultValue={service.price}
                                id={`service-price-${service.id}`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Icon (Lucide Name)</Label>
                              <Input 
                                defaultValue={service.icon}
                                id={`service-icon-${service.id}`}
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Description</Label>
                              <Textarea 
                                defaultValue={service.description}
                                id={`service-desc-${service.id}`}
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Features (One per line)</Label>
                              <Textarea 
                                defaultValue={service.features?.join("\n")}
                                id={`service-features-${service.id}`}
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => {
                              setEditingServiceId(null);
                              setIsAddingService(false);
                            }}>Cancel</Button>
                            <Button onClick={() => {
                              const name = (document.getElementById(`service-name-${service.id}`) as HTMLInputElement).value;
                              const price = (document.getElementById(`service-price-${service.id}`) as HTMLInputElement).value;
                              const icon = (document.getElementById(`service-icon-${service.id}`) as HTMLInputElement).value;
                              const description = (document.getElementById(`service-desc-${service.id}`) as HTMLTextAreaElement).value;
                              const features = (document.getElementById(`service-features-${service.id}`) as HTMLTextAreaElement).value.split('\n').filter(Boolean);
                              
                              const newService = { id: service.id === "new" ? Date.now().toString() : service.id, name, price, icon, description, features };
                              
                              if (service.id === "new") {
                                setFormData(prev => ({ ...prev, services: [newService, ...prev.services] }));
                                setIsAddingService(false);
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  services: prev.services.map(s => s.id === service.id ? newService : s)
                                }));
                                setEditingServiceId(null);
                              }
                            }}>Save Service</Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={service.id} className="border p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">Starting at ${service.price} • {service.features?.length || 0} features</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setEditingServiceId(service.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                            if (window.confirm("Are you sure you want to delete this service?")) {
                              setFormData(prev => ({
                                ...prev,
                                services: prev.services.filter(s => s.id !== service.id)
                              }));
                            }
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "Projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Projects</h3>
                  <Button onClick={() => setIsAddingProject(true)} disabled={isAddingProject}>
                    <Plus className="w-4 h-4 mr-2" /> Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {(isAddingProject ? [{ id: "new", name: "", description: "", status: "Live", features: [] as string[], progress: 100, timeline: "", live: true } as ProjectData] : [] as ProjectData[]).concat(formData.projects).map(project => {
                    const isEditing = editingProjectId === project.id || (isAddingProject && project.id === "new");
                    
                    if (isEditing) {
                      return (
                        <div key={project.id} className="border p-4 rounded-lg space-y-4 bg-card/50">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input defaultValue={project.name} id={`project-name-${project.id}`} />
                            </div>
                            <div className="space-y-2">
                              <Label>Status Badge Text</Label>
                              <Input defaultValue={project.status} id={`project-status-${project.id}`} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Description</Label>
                              <Textarea defaultValue={project.description} id={`project-desc-${project.id}`} />
                            </div>
                            <div className="space-y-2">
                              <Label>Timeline</Label>
                              <Input defaultValue={project.timeline} id={`project-timeline-${project.id}`} />
                            </div>
                            <div className="space-y-2">
                              <Label>Progress (%)</Label>
                              <Input type="number" min="0" max="100" defaultValue={project.progress} id={`project-progress-${project.id}`} />
                            </div>
                            <div className="space-y-2 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mt-4">
                                <Switch defaultChecked={project.live} id={`project-live-${project.id}`} />
                                <Label>Live Link Active</Label>
                              </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Features (One per line)</Label>
                              <Textarea defaultValue={project.features?.join("\n")} id={`project-features-${project.id}`} className="min-h-[100px]" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => { setEditingProjectId(null); setIsAddingProject(false); }}>Cancel</Button>
                            <Button onClick={() => {
                              const name = (document.getElementById(`project-name-${project.id}`) as HTMLInputElement).value;
                              const status = (document.getElementById(`project-status-${project.id}`) as HTMLInputElement).value;
                              const description = (document.getElementById(`project-desc-${project.id}`) as HTMLTextAreaElement).value;
                              const timeline = (document.getElementById(`project-timeline-${project.id}`) as HTMLInputElement).value;
                              const progress = parseInt((document.getElementById(`project-progress-${project.id}`) as HTMLInputElement).value || "0", 10);
                              const features = (document.getElementById(`project-features-${project.id}`) as HTMLTextAreaElement).value.split('\n').filter(Boolean);
                              
                              // Use alternative way to get switch state if id isn't working directly
                              const liveBtn = document.getElementById(`project-live-${project.id}`);
                              const live = liveBtn ? liveBtn.getAttribute('aria-checked') === 'true' : project.live;
                              
                              const newProject = { id: project.id === "new" ? Date.now().toString() : project.id, name, status, description, timeline, progress, live, features };
                              
                              if (project.id === "new") {
                                setFormData(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));
                                setIsAddingProject(false);
                              } else {
                                setFormData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === project.id ? newProject : p) }));
                                setEditingProjectId(null);
                              }
                            }}>Save Project</Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={project.id} className="border p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {project.name}
                            <span className="px-2 py-0.5 rounded text-xs bg-muted">{project.status}</span>
                          </h4>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => setEditingProjectId(project.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                            if (window.confirm("Are you sure you want to delete this project?")) {
                              setFormData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== project.id) }));
                            }
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "Testimonials" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Testimonials</h3>
                  <Button onClick={() => setIsAddingTestimonial(true)} disabled={isAddingTestimonial}>
                    <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                  </Button>
                </div>

                <div className="space-y-4">
                  {(isAddingTestimonial ? [{ id: "new", author: "", role: "", quote: "", rating: 5 }] : []).concat(formData.testimonials).map(testimonial => {
                    const isEditing = editingTestimonialId === testimonial.id || (isAddingTestimonial && testimonial.id === "new");
                    
                    if (isEditing) {
                      return (
                        <div key={testimonial.id} className="border p-4 rounded-lg space-y-4 bg-card/50">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Author Name</Label>
                              <Input defaultValue={testimonial.author} id={`test-author-${testimonial.id}`} />
                            </div>
                            <div className="space-y-2">
                              <Label>Role/Company</Label>
                              <Input defaultValue={testimonial.role} id={`test-role-${testimonial.id}`} />
                            </div>
                            <div className="space-y-2">
                              <Label>Rating (1-5)</Label>
                              <Input type="number" min="1" max="5" defaultValue={testimonial.rating} id={`test-rating-${testimonial.id}`} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Quote</Label>
                              <Textarea defaultValue={testimonial.quote} id={`test-quote-${testimonial.id}`} className="min-h-[100px]" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => { setEditingTestimonialId(null); setIsAddingTestimonial(false); }}>Cancel</Button>
                            <Button onClick={() => {
                              const author = (document.getElementById(`test-author-${testimonial.id}`) as HTMLInputElement).value;
                              const role = (document.getElementById(`test-role-${testimonial.id}`) as HTMLInputElement).value;
                              const quote = (document.getElementById(`test-quote-${testimonial.id}`) as HTMLTextAreaElement).value;
                              const rating = parseInt((document.getElementById(`test-rating-${testimonial.id}`) as HTMLInputElement).value || "5", 10);
                              
                              const newTestimonial = { id: testimonial.id === "new" ? Date.now().toString() : testimonial.id, author, role, quote, rating };
                              
                              if (testimonial.id === "new") {
                                setFormData(prev => ({ ...prev, testimonials: [newTestimonial, ...prev.testimonials] }));
                                setIsAddingTestimonial(false);
                              } else {
                                setFormData(prev => ({ ...prev, testimonials: prev.testimonials.map(t => t.id === testimonial.id ? newTestimonial : t) }));
                                setEditingTestimonialId(null);
                              }
                            }}>Save Testimonial</Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={testimonial.id} className="border p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {testimonial.author}
                            <span className="text-xs text-muted-foreground font-normal">({testimonial.role})</span>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{testimonial.quote}"</p>
                          <div className="flex gap-1 mt-2 text-primary">
                            {"★".repeat(testimonial.rating)}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => setEditingTestimonialId(testimonial.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                            if (window.confirm("Are you sure you want to delete this testimonial?")) {
                              setFormData(prev => ({ ...prev, testimonials: prev.testimonials.filter(t => t.id !== testimonial.id) }));
                            }
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "Pricing" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Pricing Plans</h3>
                  <Button onClick={() => setIsAddingPricing(true)} disabled={isAddingPricing}>
                    <Plus className="w-4 h-4 mr-2" /> Add Plan
                  </Button>
                </div>

                <div className="space-y-4">
                  {(isAddingPricing ? [{ id: "new", name: "", monthly: "" as string | number, annual: "" as string | number, features: [] as string[], recommended: false } as PricingData] : [] as PricingData[]).concat(formData.pricing).map(plan => {
                    const isEditing = editingPricingId === plan.id || (isAddingPricing && plan.id === "new");
                    
                    if (isEditing) {
                      return (
                        <div key={plan.id} className="border p-4 rounded-lg space-y-4 bg-card/50">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Plan Name</Label>
                              <Input defaultValue={plan.name} id={`plan-name-${plan.id}`} />
                            </div>
                            <div className="space-y-2 flex flex-col justify-center">
                              <div className="flex items-center gap-2 mt-4">
                                <Switch defaultChecked={plan.recommended} id={`plan-recommended-${plan.id}`} />
                                <Label>Recommended (Highlighted)</Label>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Monthly Price (Number or Text)</Label>
                              <Input defaultValue={plan.monthly} id={`plan-monthly-${plan.id}`} />
                            </div>
                            <div className="space-y-2">
                              <Label>Annual Price (Number or Text)</Label>
                              <Input defaultValue={plan.annual} id={`plan-annual-${plan.id}`} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Features (One per line)</Label>
                              <Textarea defaultValue={plan.features?.join("\n")} id={`plan-features-${plan.id}`} className="min-h-[100px]" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => { setEditingPricingId(null); setIsAddingPricing(false); }}>Cancel</Button>
                            <Button onClick={() => {
                              const name = (document.getElementById(`plan-name-${plan.id}`) as HTMLInputElement).value;
                              let monthly: string | number = (document.getElementById(`plan-monthly-${plan.id}`) as HTMLInputElement).value;
                              let annual: string | number = (document.getElementById(`plan-annual-${plan.id}`) as HTMLInputElement).value;
                              const features = (document.getElementById(`plan-features-${plan.id}`) as HTMLTextAreaElement).value.split('\n').filter(Boolean);
                              
                              if (!isNaN(Number(monthly)) && monthly.trim() !== "") monthly = Number(monthly);
                              if (!isNaN(Number(annual)) && annual.trim() !== "") annual = Number(annual);
                              
                              const recBtn = document.getElementById(`plan-recommended-${plan.id}`);
                              const recommended = recBtn ? recBtn.getAttribute('aria-checked') === 'true' : plan.recommended;
                              
                              const newPlan = { id: plan.id === "new" ? Date.now().toString() : plan.id, name, monthly, annual, recommended, features };
                              
                              if (plan.id === "new") {
                                setFormData(prev => ({ ...prev, pricing: [newPlan, ...prev.pricing] }));
                                setIsAddingPricing(false);
                              } else {
                                setFormData(prev => ({ ...prev, pricing: prev.pricing.map(p => p.id === plan.id ? newPlan : p) }));
                                setEditingPricingId(null);
                              }
                            }}>Save Plan</Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={plan.id} className="border p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {plan.name}
                            {plan.recommended && <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-primary text-primary-foreground font-bold tracking-widest">Recommended</span>}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            ${plan.monthly}/mo • ${plan.annual}/yr • {plan.features?.length || 0} features
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => setEditingPricingId(plan.id)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                            if (window.confirm("Are you sure you want to delete this plan?")) {
                              setFormData(prev => ({ ...prev, pricing: prev.pricing.filter(p => p.id !== plan.id) }));
                            }
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "Contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp</Label>
                    <Input value={formData.contactWhatsApp} onChange={e => setFormData({...formData, contactWhatsApp: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Discord</Label>
                    <Input value={formData.contactDiscord} onChange={e => setFormData({...formData, contactDiscord: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={formData.contactLocation} onChange={e => setFormData({...formData, contactLocation: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "SEO" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Site Title</Label>
                  <Input value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}