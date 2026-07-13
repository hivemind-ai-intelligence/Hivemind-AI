import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  discord: z.string().optional(),
  budget: z.string({ required_error: "Please select a budget range." }),
  service: z.string({ required_error: "Please select a primary service." }),
  message: z.string().min(10, "Message must be at least 10 characters.")
});

export default function EnquiryForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data } = useAdminData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      discord: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const existing = JSON.parse(localStorage.getItem("hivemind-leads") || "[]");
      localStorage.setItem("hivemind-leads", JSON.stringify([
        ...existing,
        { ...values, timestamp: new Date().toISOString() }
      ]));
    } catch (_) {}
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      form.reset();
    }, 4000);
  }

  return (
    <section className="py-32 relative bg-card/30" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 metallic-text"
            >
              Start a Project
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Tell us about your vision. We'll bring it to reality.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden bg-card/50"
          >
            {isSubmitted ? (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Request Received</h3>
                <p className="text-muted-foreground">The {data.brandName} team will analyze your requirements and contact you shortly.</p>
              </div>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-card border-border text-foreground focus-visible:ring-ring h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" className="bg-card border-border text-foreground focus-visible:ring-ring h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="discord"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Discord Username (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="john#1234" className="bg-card border-border text-foreground focus-visible:ring-ring h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-card border-border text-foreground focus:ring-ring h-12">
                              <SelectValue placeholder="Select a budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="under500">Under $500</SelectItem>
                            <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                            <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                            <SelectItem value="5k+">$5,000+</SelectItem>
                            <SelectItem value="enterprise">Enterprise / Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Primary Service Needed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-card border-border text-foreground focus:ring-ring h-12">
                            <SelectValue placeholder="What can we build for you?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {data.services.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                          <SelectItem value="other">Other / Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Project Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your project, goals, and timeline..." 
                          className="bg-card border-border text-foreground focus-visible:ring-ring min-h-[150px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-14 text-base font-semibold rounded-xl">
                  Initialize Transmission
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}