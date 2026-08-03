export enum Capability {
  KNOWLEDGE_SEARCH = "knowledge_search",
  VISION = "vision",
  CRM = "crm",
  EMAIL = "email"
}

export class CapabilityRegistry {
  private allowedCapabilities = new Set<Capability>();

  enable(capability: Capability): void {
    this.allowedCapabilities.add(capability);
  }

  disable(capability: Capability): void {
    this.allowedCapabilities.delete(capability);
  }

  has(capability: Capability): boolean {
    return this.allowedCapabilities.has(capability);
  }

  getEnabled(): Capability[] {
    return Array.from(this.allowedCapabilities.values());
  }
}

// In a real multi-tenant app, this would be tied to a User/Session context rather than global
export const globalCapabilityRegistry = new CapabilityRegistry();
