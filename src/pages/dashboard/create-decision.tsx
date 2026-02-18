import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const step1Schema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;

export function CreateDecisionPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  const onSubmit = async (_data: Step1Data) => {
    await new Promise((r) => setTimeout(r, 500));
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Create decision</h1>
        <p className="text-muted-foreground">Multi-step publisher: info, options, cost, recommendation, audience.</p>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Decision info</CardTitle>
              <CardDescription>Title and description for the decision card.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="e.g. Kitchen finish options" className={cn(errors.title && "border-destructive")} {...register("title")} />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input id="description" placeholder="Brief context" {...register("description")} />
                </div>
                <Button type="submit" disabled={isSubmitting}>Next: Options</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="options">
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
              <CardDescription>Add comparison options; upload images/PDFs per option.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Option uploader and preview. Add at least two options.</p>
              <Button variant="secondary" className="mt-4">Add option</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cost">
          <Card>
            <CardHeader>
              <CardTitle>Cost & recommendation</CardTitle>
              <CardDescription>Cost deltas per option and recommended option.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Cost delta fields and recommended flag.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience & publish</CardTitle>
              <CardDescription>Who can see this decision; schedule publish and notify.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Audience selection and publish scheduling.</p>
              <Button className="mt-4">Publish decision</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
