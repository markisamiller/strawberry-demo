export interface DemoEntry {
  id: number;
  slug: string;
  filename: string;
  contributor: string;
  angle_deg: number;
  ped_pixels_pred: number;
  ped_pixels_gt: number;
  image_w: number;
  image_h: number;
  paths: {
    thumbnail: string;
    crop: string;
    segmentation: string;
    angle: string;
  };
}
