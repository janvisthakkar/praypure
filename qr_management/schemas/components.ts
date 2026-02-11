import { z } from 'zod';
import { QRCodeSchema } from './qrcode';

export const QRCodeCardPropsSchema = z.object({
  qrCode: QRCodeSchema,
  onDownload: z.function().input(z.tuple([QRCodeSchema])).output(z.void()),
  onDelete: z.function().input(z.tuple([z.string()])).output(z.void())
});

export const SidebarPropsSchema = z.object({
  activeTab: z.string(),
  setActiveTab: z.function().input(z.tuple([z.string()])).output(z.void())
});

export const HeaderPropsSchema = z.object({
  toggleSidebar: z.function().input(z.tuple([])).output(z.void()).optional()
});

export const StatsOverviewPropsSchema = z.object({
  qrCodes: z.array(QRCodeSchema.extend({ scans: z.number() }))
});

export const QuickActionsPropsSchema = z.object({
  onAction: z.function().input(z.tuple([z.string()])).output(z.void())
});

export type QRCodeCardProps = z.infer<typeof QRCodeCardPropsSchema>;
export type SidebarProps = z.infer<typeof SidebarPropsSchema>;
export type HeaderProps = z.infer<typeof HeaderPropsSchema>;
export type StatsOverviewProps = z.infer<typeof StatsOverviewPropsSchema>;
export type QuickActionsProps = z.infer<typeof QuickActionsPropsSchema>;