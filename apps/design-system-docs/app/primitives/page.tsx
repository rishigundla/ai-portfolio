'use client'

import * as React from 'react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Label,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Combobox,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@rishi/design-system/primitives'
import { Section, SubSection } from '../_components/Section'
import { Download, Zap } from 'lucide-react'

const comboboxOptions = [
  { value: 'revops-sales', label: 'RevOps Sales SSOT' },
  { value: 'marketing', label: 'Marketing Campaigns' },
  { value: 'pulse-nai', label: 'Pulse Telemetry · NAI' },
  { value: 'supply', label: 'Supply Chain' },
]

export default function PrimitivesPage() {
  const [combo, setCombo] = React.useState('')

  return (
    <Section
      eyebrow="02 · Primitives"
      title="Primitive components"
      description="14 accessible base components built on Radix UI + cva, each themed to the token system. Compose these into AI-specific components."
    >
      <TooltipProvider>
        <SubSection label="Button" description="6 variants × 4 sizes">
          <div className="rounded-xl border border-surface-border bg-surface p-6 space-y-5">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" variant="secondary">
                <Zap className="h-4 w-4" />
              </Button>
              <Button disabled>Disabled</Button>
              <Button>
                <Download className="h-4 w-4" />
                With icon
              </Button>
            </div>
          </div>
        </SubSection>

        <SubSection label="Card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle>Composable card</CardTitle>
                <CardDescription>
                  Card + Header + Title + Description + Content + Footer.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-text-secondary">
                Use this as the container for any grouped content.
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Take action
                </Button>
              </CardFooter>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-text-secondary">
                Or just use <code className="font-mono text-accent text-xs">Card</code> alone with any content you like.
              </p>
            </Card>
          </div>
        </SubSection>

        <SubSection label="Badge" description="6 variants × 3 sizes">
          <div className="rounded-xl border border-surface-border bg-surface p-6 flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">In Progress</Badge>
            <Badge variant="danger">Blocked</Badge>
            <Badge variant="muted">Muted</Badge>
            <Badge size="sm">Small</Badge>
            <Badge size="lg" variant="accent">Large Accent</Badge>
          </div>
        </SubSection>

        <SubSection label="Input & Label">
          <div className="rounded-xl border border-surface-border bg-surface p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="demo-email">Email</Label>
              <Input id="demo-email" type="email" placeholder="you@nutanix.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="demo-name">Name</Label>
              <Input id="demo-name" placeholder="Rishi Gundla" defaultValue="Rishi Gundla" />
            </div>
          </div>
        </SubSection>

        <SubSection label="Dialog · Popover · Tooltip">
          <div className="rounded-xl border border-surface-border bg-surface p-6 flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog example</DialogTitle>
                  <DialogDescription>
                    Accessible modal with focus trap, escape to close, and animated entry.
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-text-secondary">
                  All Radix modals respect prefers-reduced-motion.
                </div>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <h4 className="font-display font-semibold text-sm mb-1">Popover content</h4>
                <p className="text-xs text-text-muted">Portal-rendered. Closes on outside click.</p>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover for tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </div>
        </SubSection>

        <SubSection label="Tabs">
          <Tabs defaultValue="overview" className="rounded-xl border border-surface-border bg-surface p-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-sm text-text-secondary">
              Tabs use Radix under the hood. Active tab gets the accent background and a subtle glow.
            </TabsContent>
            <TabsContent value="metrics" className="text-sm text-text-secondary">
              Metrics panel content.
            </TabsContent>
            <TabsContent value="alerts" className="text-sm text-text-secondary">
              Alerts panel content.
            </TabsContent>
          </Tabs>
        </SubSection>

        <SubSection label="Select & Combobox">
          <div className="rounded-xl border border-surface-border bg-surface p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="flex flex-col gap-2">
              <Label>Select (single value)</Label>
              <Select defaultValue="sales">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">RevOps Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="supply">Supply Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Combobox (searchable)</Label>
              <Combobox
                options={comboboxOptions}
                value={combo}
                onValueChange={setCombo}
                placeholder="Pick a dataset"
              />
            </div>
          </div>
        </SubSection>

        <SubSection label="Avatar">
          <div className="rounded-xl border border-surface-border bg-surface p-6 flex items-center gap-4">
            <Avatar>
              <AvatarImage src="" alt="RG" />
              <AvatarFallback>RG</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback>AE</AvatarFallback>
            </Avatar>
          </div>
        </SubSection>
      </TooltipProvider>
    </Section>
  )
}
