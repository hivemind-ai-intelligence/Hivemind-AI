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
    console.log(values);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      form.reset();
    }, 3000);
  }

  return (
    <section className="py-32 relative" id="contact">
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
              className="text-neutral-400 text-lg"
            >
              Tell us about your vision. We'll bring it to reality.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
          >
            {isSubmitted ? (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                <p className="text-neutral-400">The HiveMind team will analyze your requirements and contact you shortly.</p>
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
                        <FormLabel className="text-neutral-300">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white focus-visible:ring-white/30 h-12" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-300">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" className="bg-white/5 border-white/10 text-white focus-visible:ring-white/30 h-12" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
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
                        <FormLabel className="text-neutral-300">Discord Username (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="john#1234" className="bg-white/5 border-white/10 text-white focus-visible:ring-white/30 h-12" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-300">Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-white/30 h-12">
                              <SelectValue placeholder="Select a budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-900 border-white/10 text-white">
                            <SelectItem value="under500">Under $500</SelectItem>
                            <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                            <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                            <SelectItem value="5k+">$5,000+</SelectItem>
                            <SelectItem value="enterprise">Enterprise / Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-300">Primary Service Needed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-white/30 h-12">
                            <SelectValue placeholder="What can we build for you?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-900 border-white/10 text-white max-h-[300px]">
                          <SelectItem value="website">Website Development</SelectItem>
                          <SelectItem value="discord">Discord Bots</SelectItem>
                          <SelectItem value="ai_system">AI Systems</SelectItem>
                          <SelectItem value="automation">Automation</SelectItem>
                          <SelectItem value="branding">Branding</SelectItem>
                          <SelectItem value="dashboard">Dashboard Development</SelectItem>
                          <SelectItem value="other">Other / Not Sure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-300">Project Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your project, goals, and timeline..." 
                          className="bg-white/5 border-white/10 text-white focus-visible:ring-white/30 min-h-[150px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-14 bg-white text-black hover:bg-neutral-200 text-base font-semibold rounded-xl">
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
