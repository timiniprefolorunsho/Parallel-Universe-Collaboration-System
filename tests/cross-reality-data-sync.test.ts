import { describe, it, beforeEach, expect } from "vitest"

describe("Cross-reality Data Synchronization Contract", () => {
  let mockStorage: Map<string, any>
  let nextDataId: number
  
  beforeEach(() => {
    mockStorage = new Map()
    nextDataId = 0
  })
  
  const mockContractCall = (method: string, args: any[] = []) => {
    switch (method) {
      case "sync-data":
        const [content, universeId] = args
        const id = nextDataId++
        mockStorage.set(id, { content, universes: [universeId] })
        return { success: true, value: id }
      case "update-sync":
        const [dataId, updateUniverseId] = args
        if (!mockStorage.has(dataId)) return { success: false, error: 404 }
        const data = mockStorage.get(dataId)
        data.universes.push(updateUniverseId)
        return { success: true }
      case "get-synced-data":
        return { success: true, value: mockStorage.get(args[0]) }
      default:
        return { success: false, error: "Unknown method" }
    }
  }
  
  it("should sync new data", () => {
    const result = mockContractCall("sync-data", ["Test data", "universe1"])
    expect(result.success).toBe(true)
    expect(result.value).toBe(0)
  })
  
  it("should update synced data", () => {
    mockContractCall("sync-data", ["Initial data", "universe1"])
    const result = mockContractCall("update-sync", [0, "universe2"])
    expect(result.success).toBe(true)
  })
  
  it("should get synced data", () => {
    mockContractCall("sync-data", ["Test data", "universe1"])
    const result = mockContractCall("get-synced-data", [0])
    expect(result.success).toBe(true)
    expect(result.value.content).toBe("Test data")
    expect(result.value.universes).toContain("universe1")
  })
})

