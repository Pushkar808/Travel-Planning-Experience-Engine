import { cn } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge tailwind classes properly", () => {
      const result = cn("text-red-500", "bg-blue-500", "p-4");
      expect(result).toBe("text-red-500 bg-blue-500 p-4");
    });

    it("should resolve tailwind conflicts using twMerge", () => {
      const result = cn("text-red-500", "text-blue-500");
      expect(result).toBe("text-blue-500");
    });

    it("should conditionally apply classes", () => {
      const isActive = true;
      const isError = false;
      const result = cn("base-class", {
        "active-class": isActive,
        "error-class": isError,
      });
      expect(result).toBe("base-class active-class");
    });
  });
});
