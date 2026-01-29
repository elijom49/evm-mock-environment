const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SimpleStorage", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const storage = await SimpleStorage.deploy();
    return { storage, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the deployer as owner", async function () {
      const { storage, owner } = await loadFixture(deployFixture);
      expect(await storage.owner()).to.equal(owner.address);
    });

    it("Should initialize with value 0", async function () {
      const { storage } = await loadFixture(deployFixture);
      expect(await storage.get()).to.equal(0);
    });
  });

  describe("Storage", function () {
    it("Should store a value", async function () {
      const { storage } = await loadFixture(deployFixture);
      await storage.set(42);
      expect(await storage.get()).to.equal(42);
    });

    it("Should emit ValueChanged event", async function () {
      const { storage, owner } = await loadFixture(deployFixture);
      await expect(storage.set(100))
        .to.emit(storage, "ValueChanged")
        .withArgs(0, 100, owner.address);
    });

    it("Should allow anyone to set value", async function () {
      const { storage, user1 } = await loadFixture(deployFixture);
      await storage.connect(user1).set(999);
      expect(await storage.get()).to.equal(999);
    });
  });
});
