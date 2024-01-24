import { PluginContent } from '../../types/plugin';

export class PluginCore {
  private byType = new Map<string, PluginContent[]>();
  private bySlug = new Map<string, PluginContent>();

  get(slug: string) {
    return this.bySlug.get(slug);
  }
  getByType(type: string) {
    return this.byType.get(type) ?? [];
  }
  set(plugin: PluginContent) {
    this.bySlug.set(plugin.slug, plugin);

    const plugins = this.getByType(plugin.type);
    plugins.push(plugin);
    this.byType.set(plugin.type, plugins);
  }
  delete(slug: string) {
    const plugin = this.get(slug);
    if (!plugin) return false;

    // slug
    this.bySlug.delete(plugin.slug);

    // type
    const plugins = this.getByType(plugin.type).filter(
      (p) => p.slug !== plugin.slug
    );
    this.byType.set(plugin.type, plugins);

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
