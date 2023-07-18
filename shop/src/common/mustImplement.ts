import { Req, Res } from '@nodeeweb/core/types/global';

export async function checkSiteStatus(): Promise<boolean> {
  return true;
}

export function fireEvent(event: 'create-order-by-customer', value: any) {}

export function submitAction(action: {
  user: any;
  title: string;
  history: any;
  order?: any;
  data?: any;
}) {}

export function updateThemeConfig(object: any) {}
export async function show(req: Req, res: Res) {}
