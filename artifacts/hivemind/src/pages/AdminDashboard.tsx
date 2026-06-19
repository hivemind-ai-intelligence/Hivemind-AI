import { useState, useEffect } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import type { AdminData, ServiceData, ProjectData, TestimonialData, PricingData, WorldCountry, AITrait, AIFeature, AITimelineEvent, AILanguage, AITeamMember, AIActivityItem } from "@/context/AdminDataContext";
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

const TABS = ["Branding", "Founder", "Services", "Projects", "Testimonials", "Pricing", "Contact", "SEO", "World Map", "HiveMind AI"];

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

  // World Map Editor State
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [isAddingCountry, setIsAddingCountry] = useState(false);

  // HiveMind AI Trait Editor State
  const [editingTraitId, setEditingTraitId] = useState<string | null>(null);
  const [isAddingTrait, setIsAddingTrait] = useState(false);

  // HiveMind AI Feature Editor State
  const [editingAIFeatureId, setEditingAIFeatureId] = useState<string | null>(null);
  const [isAddingAIFeature, setIsAddingAIFeature] = useState(false);

  // HiveMind AI Timeline Editor State
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);

  // HiveMind AI Language Editor State
  const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);

  // HiveMind AI Team Editor State
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);

  // HiveMind AI Activity Editor State
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);

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

            {/* ── WORLD MAP TAB ── */}
            {activeTab === "World Map" && (
              <div className="space-y-8">
                {/* Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Global Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Active Regions</Label>
                      <Input type="number" value={formData.worldActiveRegions} onChange={e => setFormData({...formData, worldActiveRegions: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Projects Count</Label>
                      <Input type="number" value={formData.worldProjects} onChange={e => setFormData({...formData, worldProjects: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Languages Supported</Label>
                      <Input type="number" value={formData.worldLanguages} onChange={e => setFormData({...formData, worldLanguages: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>AI Coverage</Label>
                      <Input value={formData.worldAICoverage} onChange={e => setFormData({...formData, worldAICoverage: e.target.value})} placeholder="e.g. 24/7" />
                    </div>
                  </div>
                </div>

                {/* Countries */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Countries</h3>
                    <Button onClick={() => setIsAddingCountry(true)} disabled={isAddingCountry}>
                      <Plus className="w-4 h-4 mr-2" /> Add Country
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">X/Y position: 0-100% on the world map. Use lat/lng coordinates or estimate visually (left-right, top-bottom).</p>

                  <div className="space-y-3">
                    {(isAddingCountry ? [{ id: "new", name: "", flag: "🌍", active: false, projects: 0, x: 50, y: 50 } as WorldCountry, ...formData.worldCountries] : formData.worldCountries).map(country => {
                      const isEditing = editingCountryId === country.id || (isAddingCountry && country.id === "new");
                      if (isEditing) {
                        return (
                          <div key={country.id} className="border p-4 rounded-lg space-y-4 bg-card/50">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label>Country Name</Label>
                                <Input defaultValue={country.name} id={`country-name-${country.id}`} placeholder="India" />
                              </div>
                              <div className="space-y-1">
                                <Label>Flag Emoji</Label>
                                <Input defaultValue={country.flag} id={`country-flag-${country.id}`} placeholder="🇮🇳" />
                              </div>
                              <div className="space-y-1">
                                <Label>Projects</Label>
                                <Input type="number" defaultValue={country.projects} id={`country-projects-${country.id}`} />
                              </div>
                              <div className="space-y-1">
                                <Label>Active?</Label>
                                <Switch defaultChecked={country.active} id={`country-active-${country.id}`} />
                              </div>
                              <div className="space-y-1">
                                <Label>Map X Position (0-100)</Label>
                                <Input type="number" min="0" max="100" defaultValue={country.x} id={`country-x-${country.id}`} />
                              </div>
                              <div className="space-y-1">
                                <Label>Map Y Position (0-100)</Label>
                                <Input type="number" min="0" max="100" defaultValue={country.y} id={`country-y-${country.id}`} />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => { setEditingCountryId(null); setIsAddingCountry(false); }}>Cancel</Button>
                              <Button onClick={() => {
                                const name = (document.getElementById(`country-name-${country.id}`) as HTMLInputElement).value;
                                const flag = (document.getElementById(`country-flag-${country.id}`) as HTMLInputElement).value;
                                const projects = parseInt((document.getElementById(`country-projects-${country.id}`) as HTMLInputElement).value || "0", 10);
                                const x = parseFloat((document.getElementById(`country-x-${country.id}`) as HTMLInputElement).value || "50");
                                const y = parseFloat((document.getElementById(`country-y-${country.id}`) as HTMLInputElement).value || "50");
                                const activeEl = document.getElementById(`country-active-${country.id}`);
                                const active = activeEl ? activeEl.getAttribute('aria-checked') === 'true' : country.active;
                                const newCountry: WorldCountry = { id: country.id === "new" ? Date.now().toString() : country.id, name, flag, projects, x, y, active };
                                if (country.id === "new") {
                                  setFormData(prev => ({ ...prev, worldCountries: [newCountry, ...prev.worldCountries] }));
                                  setIsAddingCountry(false);
                                } else {
                                  setFormData(prev => ({ ...prev, worldCountries: prev.worldCountries.map(c => c.id === country.id ? newCountry : c) }));
                                  setEditingCountryId(null);
                                }
                              }}>Save Country</Button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={country.id} className="border p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{country.flag}</span>
                            <div>
                              <span className="font-medium text-sm">{country.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{country.projects} projects</span>
                            </div>
                            {country.active && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Active</span>}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => setEditingCountryId(country.id)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                              if (window.confirm("Delete this country?")) {
                                setFormData(prev => ({ ...prev, worldCountries: prev.worldCountries.filter(c => c.id !== country.id) }));
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
              </div>
            )}

            {/* ── HIVEMIND AI TAB ── */}
            {activeTab === "HiveMind AI" && (
              <div className="space-y-10">

                {/* Identity Fields */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">AI Identity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>AI Name</Label>
                      <Input value={formData.hivemindAIName} onChange={e => setFormData({...formData, hivemindAIName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={formData.hivemindAIRole} onChange={e => setFormData({...formData, hivemindAIRole: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Tagline</Label>
                      <Input value={formData.hivemindAITagline} onChange={e => setFormData({...formData, hivemindAITagline: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Description</Label>
                      <Textarea value={formData.hivemindAIDescription} onChange={e => setFormData({...formData, hivemindAIDescription: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Input value={formData.hivemindAIStatus} onChange={e => setFormData({...formData, hivemindAIStatus: e.target.value})} placeholder="Online" />
                    </div>
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Input value={formData.hivemindAIVersion} onChange={e => setFormData({...formData, hivemindAIVersion: e.target.value})} placeholder="v2.4.1" />
                    </div>
                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <Input value={formData.hivemindAIAvailability} onChange={e => setFormData({...formData, hivemindAIAvailability: e.target.value})} placeholder="24/7" />
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Badge (optional)</Label>
                      <Input value={formData.hivemindAICustomBadge} onChange={e => setFormData({...formData, hivemindAICustomBadge: e.target.value})} placeholder="Leave blank to hide" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                      <Switch checked={formData.hivemindAIShowVerifiedBadge} onCheckedChange={v => setFormData({...formData, hivemindAIShowVerifiedBadge: v})} />
                      <Label>Show Verified AI Badge</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={formData.hivemindAIShowCoFounderBadge} onCheckedChange={v => setFormData({...formData, hivemindAIShowCoFounderBadge: v})} />
                      <Label>Show Digital Co-Founder Badge</Label>
                    </div>
                  </div>
                </div>

                {/* Icon Upload */}
                <div className="border p-4 rounded-lg space-y-2">
                  <Label>AI Icon / Avatar</Label>
                  <div className="flex items-center gap-4">
                    {formData.hivemindAIIconDataUrl ? (
                      <img src={formData.hivemindAIIconDataUrl} alt="AI Icon" className="w-16 h-16 rounded-2xl object-contain bg-neutral-800 p-1" />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center text-xs text-neutral-500">None</div>
                    )}
                    <Input type="file" accept=".png,.jpg,.jpeg,.webp,.svg" onChange={(e) => handleFileUpload(e, 'hivemindAIIconDataUrl')} />
                    {formData.hivemindAIIconDataUrl && <Button variant="destructive" size="sm" onClick={() => setFormData({...formData, hivemindAIIconDataUrl: null})}>Remove</Button>}
                  </div>
                </div>

                {/* Hero Buttons */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hero Buttons</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Button Text</Label>
                      <Input value={formData.hivemindAIPrimaryBtnText} onChange={e => setFormData({...formData, hivemindAIPrimaryBtnText: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Button Link</Label>
                      <Input value={formData.hivemindAIPrimaryBtnLink} onChange={e => setFormData({...formData, hivemindAIPrimaryBtnLink: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Button Text</Label>
                      <Input value={formData.hivemindAISecondaryBtnText} onChange={e => setFormData({...formData, hivemindAISecondaryBtnText: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Button Link</Label>
                      <Input value={formData.hivemindAISecondaryBtnLink} onChange={e => setFormData({...formData, hivemindAISecondaryBtnLink: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Story Content</h3>
                  <div className="space-y-4">
                    {[
                      { key: "hivemindAIOrigin" as keyof AdminData, label: "Origin Story" },
                      { key: "hivemindAIMission" as keyof AdminData, label: "Mission" },
                      { key: "hivemindAIVision" as keyof AdminData, label: "Vision" },
                      { key: "hivemindAIGrowthStory" as keyof AdminData, label: "Growth Story" },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}</Label>
                        <Textarea value={String(formData[key])} onChange={e => setFormData({...formData, [key]: e.target.value})} className="min-h-[80px]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personality Traits */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Personality Traits</h3>
                    <Button onClick={() => setIsAddingTrait(true)} disabled={isAddingTrait}><Plus className="w-4 h-4 mr-2" /> Add Trait</Button>
                  </div>
                  <div className="space-y-3">
                    {(isAddingTrait ? [{ id: "new", name: "", level: 80 } as AITrait, ...formData.hivemindAITraits] : formData.hivemindAITraits).map(trait => {
                      const isEditing = editingTraitId === trait.id || (isAddingTrait && trait.id === "new");
                      if (isEditing) {
                        return (
                          <div key={trait.id} className="border p-3 rounded-lg space-y-3 bg-card/50">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><Label>Trait Name</Label><Input defaultValue={trait.name} id={`trait-name-${trait.id}`} /></div>
                              <div className="space-y-1"><Label>Level (0-100)</Label><Input type="number" min="0" max="100" defaultValue={trait.level} id={`trait-level-${trait.id}`} /></div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingTraitId(null); setIsAddingTrait(false); }}>Cancel</Button>
                              <Button size="sm" onClick={() => {
                                const name = (document.getElementById(`trait-name-${trait.id}`) as HTMLInputElement).value;
                                const level = parseInt((document.getElementById(`trait-level-${trait.id}`) as HTMLInputElement).value || "80", 10);
                                const newTrait: AITrait = { id: trait.id === "new" ? Date.now().toString() : trait.id, name, level };
                                if (trait.id === "new") { setFormData(prev => ({ ...prev, hivemindAITraits: [newTrait, ...prev.hivemindAITraits] })); setIsAddingTrait(false); }
                                else { setFormData(prev => ({ ...prev, hivemindAITraits: prev.hivemindAITraits.map(t => t.id === trait.id ? newTrait : t) })); setEditingTraitId(null); }
                              }}>Save</Button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={trait.id} className="border p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="text-sm font-medium w-32 shrink-0">{trait.name}</span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-foreground rounded-full" style={{ width: `${trait.level}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-8 text-right">{trait.level}%</span>
                          </div>
                          <div className="flex gap-1 ml-4 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => setEditingTraitId(trait.id)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { if (window.confirm("Delete?")) setFormData(prev => ({ ...prev, hivemindAITraits: prev.hivemindAITraits.filter(t => t.id !== trait.id) })); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Features */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Capabilities / Features</h3>
                    <Button onClick={() => setIsAddingAIFeature(true)} disabled={isAddingAIFeature}><Plus className="w-4 h-4 mr-2" /> Add Feature</Button>
                  </div>
                  <div className="space-y-3">
                    {(isAddingAIFeature ? [{ id: "new", icon: "Globe", title: "", description: "" } as AIFeature, ...formData.hivemindAIFeatures] : formData.hivemindAIFeatures).map(feat => {
                      const isEditing = editingAIFeatureId === feat.id || (isAddingAIFeature && feat.id === "new");
                      if (isEditing) {
                        return (
                          <div key={feat.id} className="border p-3 rounded-lg space-y-3 bg-card/50">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><Label>Icon (Lucide name)</Label><Input defaultValue={feat.icon} id={`aifeat-icon-${feat.id}`} placeholder="Globe" /></div>
                              <div className="space-y-1"><Label>Title</Label><Input defaultValue={feat.title} id={`aifeat-title-${feat.id}`} /></div>
                              <div className="space-y-1 col-span-2"><Label>Description</Label><Textarea defaultValue={feat.description} id={`aifeat-desc-${feat.id}`} /></div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingAIFeatureId(null); setIsAddingAIFeature(false); }}>Cancel</Button>
                              <Button size="sm" onClick={() => {
                                const icon = (document.getElementById(`aifeat-icon-${feat.id}`) as HTMLInputElement).value;
                                const title = (document.getElementById(`aifeat-title-${feat.id}`) as HTMLInputElement).value;
                                const description = (document.getElementById(`aifeat-desc-${feat.id}`) as HTMLTextAreaElement).value;
                                const newFeat: AIFeature = { id: feat.id === "new" ? Date.now().toString() : feat.id, icon, title, description };
                                if (feat.id === "new") { setFormData(prev => ({ ...prev, hivemindAIFeatures: [newFeat, ...prev.hivemindAIFeatures] })); setIsAddingAIFeature(false); }
                                else { setFormData(prev => ({ ...prev, hivemindAIFeatures: prev.hivemindAIFeatures.map(f => f.id === feat.id ? newFeat : f) })); setEditingAIFeatureId(null); }
                              }}>Save</Button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={feat.id} className="border p-3 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">{feat.title}</span>
                            <span className="ml-2 text-xs text-muted-foreground">[{feat.icon}]</span>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{feat.description}</p>
                          </div>
                          <div className="flex gap-1 shrink-0 ml-4">
                            <Button variant="ghost" size="icon" onClick={() => setEditingAIFeatureId(feat.id)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { if (window.confirm("Delete?")) setFormData(prev => ({ ...prev, hivemindAIFeatures: prev.hivemindAIFeatures.filter(f => f.id !== feat.id) })); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Evolution Roadmap</h3>
                    <Button onClick={() => setIsAddingTimeline(true)} disabled={isAddingTimeline}><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
                  </div>
                  <div className="space-y-3">
                    {(isAddingTimeline ? [{ id: "new", year: "", title: "", description: "" } as AITimelineEvent, ...formData.hivemindAITimeline] : formData.hivemindAITimeline).map(evt => {
                      const isEditing = editingTimelineId === evt.id || (isAddingTimeline && evt.id === "new");
                      if (isEditing) {
                        return (
                          <div key={evt.id} className="border p-3 rounded-lg space-y-3 bg-card/50">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><Label>Year</Label><Input defaultValue={evt.year} id={`tl-year-${evt.id}`} placeholder="2026" /></div>
                              <div className="space-y-1"><Label>Title</Label><Input defaultValue={evt.title} id={`tl-title-${evt.id}`} /></div>
                              <div className="space-y-1 col-span-2"><Label>Description</Label><Textarea defaultValue={evt.description} id={`tl-desc-${evt.id}`} /></div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingTimelineId(null); setIsAddingTimeline(false); }}>Cancel</Button>
                              <Button size="sm" onClick={() => {
                                const year = (document.getElementById(`tl-year-${evt.id}`) as HTMLInputElement).value;
                                const title = (document.getElementById(`tl-title-${evt.id}`) as HTMLInputElement).value;
                                const description = (document.getElementById(`tl-desc-${evt.id}`) as HTMLTextAreaElement).value;
                                const newEvt: AITimelineEvent = { id: evt.id === "new" ? Date.now().toString() : evt.id, year, title, description };
                                if (evt.id === "new") { setFormData(prev => ({ ...prev, hivemindAITimeline: [newEvt, ...prev.hivemindAITimeline] })); setIsAddingTimeline(false); }
                                else { setFormData(prev => ({ ...prev, hivemindAITimeline: prev.hivemindAITimeline.map(e => e.id === evt.id ? newEvt : e) })); setEditingTimelineId(null); }
                              }}>Save</Button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={evt.id} className="border p-3 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{evt.year}</span>
                            <p className="text-sm font-medium">{evt.title}</p>
                          </div>
                          <div className="flex gap-1 shrink-0 ml-4">
                            <Button variant="ghost" size="icon" onClick={() => setEditingTimelineId(evt.id)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { if (window.confirm("Delete?")) setFormData(prev => ({ ...prev, hivemindAITimeline: prev.hivemindAITimeline.filter(e => e.id !== evt.id) })); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Language Matrix</h3>
                    <Button onClick={() => setIsAddingLanguage(true)} disabled={isAddingLanguage}><Plus className="w-4 h-4 mr-2" /> Add Language</Button>
                  </div>
                  <div className="space-y-3">
                    {(isAddingLanguage ? [{ id: "new", name: "", level: "Fluent" } as AILanguage, ...formData.hivemindAILanguages] : formData.hivemindAILanguages).map(lang => {
                      const isEditing = editingLanguageId === lang.id || (isAddingLanguage && lang.id === "new");
                      if (isEditing) {
                        return (
                          <div key={lang.id} className="border p-3 rounded-lg space-y-3 bg-card/50">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><Label>Language</Label><Input defaultValue={lang.name} id={`lang-name-${lang.id}`} /></div>
                              <div className="space-y-1">
                                <Label>Level</Label>
                                <select defaultValue={lang.level} id={`lang-level-${lang.id}`} className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                                  {["Native", "Fluent", "Advanced", "Intermediate", "Basic"].map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingLanguageId(null); setIsAddingLanguage(false); }}>Cancel</Button>
                              <Button size="sm" onClick={() => {
                                const name = (document.getElementById(`lang-name-${lang.id}`) as HTMLInputElement).value;
                                const level = (document.getElementById(`lang-level-${lang.id}`) as HTMLSelectElement).value;
                                const newLang: AILanguage = { id: lang.id === "new" ? Date.now().toString() : lang.id, name, level };
                                if (lang.id === "new") { setFormData(prev => ({ ...prev, hivemindAILanguages: [newLang, ...prev.hivemindAILanguages] })); setIsAddingLanguage(false); }
                                else { setFormData(prev => ({ ...prev, hivemindAILanguages: prev.hivemindAILanguages.map(l => l.id === lang.id ? newLang : l) })); setEditingLanguageId(null); }
                              }}>Save</Button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={lang.id} className="border p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{lang.name}</span>
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{lang.level}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" onClick={() => setEditingLanguageId(lang.id)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { if (window.confirm("Delete?")) setFormData(prev => ({ ...prev, hivemindAILanguages: prev.hivemindAILanguages.filter(l => l.id !== lang.id) })); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Team */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">AI Team Members</h3>
                    <Button onClick={() => setIsAddingTeam(true)} disabled={isAddingTeam}><Plus className="w-4 h-4 mr-2" /> Add Member</Button>
                  </div>
                  <div className="space-y-3">
                    {(isAddingTeam ? [{ id: "new", name: "", role: "", icon: "Cpu" } as AITeamMember, ...formData.hivemindAITeam] : formData.hivemindAITeam).map(member => {
                      const isEditing = editingTeamId === member.id || (isAddingTeam && member.id === "new");
                      if (isEditing) {
                        return (
                          <div key={member.id} className="border p-3 rounded-lg space-y-3 bg-card/50">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><Label>Name</Label><Input defaultValue={member.name} id={`team-name-${member.id}`} /></div>
                              <div className="space-y-1"><Label>Icon (Lucide name)</Label><Input defaultValue={member.icon} id={`team-icon-${member.id}`} placeholder="Cpu" /></div>
                              <div className="space-y-1 col-span-2"><Label>Role / Description</Label><Input defaultValue={member.role} id={`team-role-${member.id}`} /></div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingTeamId(null); setIsAddingTeam(false); }}>Cancel</Button>
                              <Button size="sm" onClick={() => {
                                const name = (document.getElementById(`team-name-${member.id}`) as HTMLInputElement).value;
                                const role = (document.getElementById(`team-role-${member.id}`) as HTMLInputElement).value;
                                const icon = (document.getElementById(`team-icon-${member.id}`) as HTMLInputElement).value;
                                const newMember: AITeamMember = { id: member.id === "new" ? Date.now().toString() : member.id, name, role, icon };
                                if (member.id === "new") { setFormData(prev => ({ ...prev, hivemindAITeam: [newMember, ...prev.hivemindAITeam] })); setIsAddingTeam(false); }
                                else { setFormData(prev => ({ ...prev, hivemindAITeam: prev.hivemindAITeam.map(m => m.id === member.id ? newMember : m) })); setEditingTeamId(null); }
                              }}>Save</Button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={member.id} className="border p-3 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">{member.name}</span>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                          <div className="flex gap-1 shrink-0 ml-4">
                            <Button variant="ghost" size="icon" onClick={() => setEditingTeamId(member.id)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { if (window.confirm("Delete?")) setFormData(prev => ({ ...prev, hivemindAITeam: prev.hivemindAITeam.filter(m => m.id !== member.id) })); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activity Feed */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Activity Feed Items</h3>
                    <Button onClick={() => setIsAddingActivity(true)} disabled={isAddingActivity}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
                  </div>
                  <div className="space-y-3">
                    {(isAddingActivity ? [{ id: "new", action: "" } as AIActivityItem, ...formData.hivemindAIActivity] : formData.hivemindAIActivity).map(item => {
                      const isEditing = editingActivityId === item.id || (isAddingActivity && item.id === "new");
                      if (isEditing) {
                        return (
                          <div key={item.id} className="border p-3 rounded-lg space-y-3 bg-card/50">
                            <div className="space-y-1"><Label>Activity Description</Label><Input defaultValue={item.action} id={`act-action-${item.id}`} placeholder="HiveMind completed..." /></div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => { setEditingActivityId(null); setIsAddingActivity(false); }}>Cancel</Button>
                              <Button size="sm" onClick={() => {
                                const action = (document.getElementById(`act-action-${item.id}`) as HTMLInputElement).value;
                                const newItem: AIActivityItem = { id: item.id === "new" ? Date.now().toString() : item.id, action };
                                if (item.id === "new") { setFormData(prev => ({ ...prev, hivemindAIActivity: [newItem, ...prev.hivemindAIActivity] })); setIsAddingActivity(false); }
                                else { setFormData(prev => ({ ...prev, hivemindAIActivity: prev.hivemindAIActivity.map(a => a.id === item.id ? newItem : a) })); setEditingActivityId(null); }
                              }}>Save</Button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={item.id} className="border p-3 rounded-lg flex items-center justify-between">
                          <p className="text-sm text-muted-foreground flex-1">{item.action}</p>
                          <div className="flex gap-1 shrink-0 ml-4">
                            <Button variant="ghost" size="icon" onClick={() => setEditingActivityId(item.id)}><Edit2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { if (window.confirm("Delete?")) setFormData(prev => ({ ...prev, hivemindAIActivity: prev.hivemindAIActivity.filter(a => a.id !== item.id) })); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}