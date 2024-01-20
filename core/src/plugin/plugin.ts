import { PluginContent } from '../../types/plugin';

export class PluginCore {
  private byType = new Map<string, PluginContent>();
  private bySlug = new Map<string, PluginContent>();

  get(id: string) {
    return this.bySlug.get(id) || this.byType.get(id);
  }
  set(plugin: PluginContent) {
    this.bySlug.set(plugin.slug, plugin);
    this.byType.set(plugin.type, plugin);
  }
  delete(id: string) {
    const plugin = this.get(id);
    if (!plugin) return false;

    // slug
    this.bySlug.delete(plugin.slug);
    // type
    this.byType.delete(plugin.type);

    return true;
  }
}

export type PluginConfig = {
  name: string;
  version: string;
  description?: string | { [key: string]: string };
  type: string;
  icon?: string;
  author: string;
  main: string;
  slug: string;
  add: {
    inputs: {
      key: string;
      title: { [key: string]: string };
      type: string;
      description?: string | { [key: string]: string };
    }[];
    dto?: string;
    run: string;
  };
  edit: {
    inputs: {
      key: string;
      title: { [key: string]: string };
      type: string;
      description?: string | { [key: string]: string };
    }[];
    dto?: string;
    run: string;
  };
};
