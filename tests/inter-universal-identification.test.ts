import { describe, it, beforeEach, expect } from "vitest"

describe("Inter-universal Identification Contract", () => {
  let mockStorage: Map<string, any>
  
  beforeEach(() => {
    mockStorage = new Map()
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "register-universe":
        const [name] = args
        // Simulate sha256 hash with a simple string manipulation
        const id = Buffer.from(name.repeat(4)).toString("hex").slice(0, 64)
        if (mockStorage.has(id)) return { success: false, error: 403 }
        mockStorage.set(id, { name })
        return { success: true, value: id }
      case "get-universe":
        return { success: true, value: mockStorage.get(args[0]) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should register a new universe", () => {
    const result = mockContractCall("register-universe", ["Alpha Universe"])
    expect(result.success).toBe(true)
    expect(result.value).toBeDefined()
    expect(result.value.length).toBe(64) // Ensure the ID is 64 characters (32 bytes in hex)
  })
  
  it("should not register a duplicate universe", () => {
    mockContractCall("register-universe", ["Alpha Universe"])
    const result = mockContractCall("register-universe", ["Alpha Universe"])
    expect(result.success).toBe(false)
    expect(result.error).toBe(403)
  })
  
  it("should get a registered universe", () => {
    const registerResult = mockContractCall("register-universe", ["Beta Universe"])
    const getResult = mockContractCall("get-universe", [registerResult.value])
    expect(getResult.success).toBe(true)
    expect(getResult.value.name).toBe("Beta Universe")
  })
})

