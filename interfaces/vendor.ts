export interface Vendor {
    id?: string;
    vendor_name: string;
    vendor_description: string;
    vendor_image_name?: string | null;
    vendor_image_url?: string | null;
    vendor_user_id?: string | null;
    updated_at?: Date;
  }