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
    return this.bySlug.delete(id) || this.byType.delete(id);
  }
}
