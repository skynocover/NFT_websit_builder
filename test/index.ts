import { expect } from "chai";
import { ethers } from "hardhat";

const nftName = "NFT Name";
const symbol = "TLK";
const coverURL = "http://localhost/image";
const title = "The Title";
const content = "An content";

describe("MintSite", function () {
  it("Should set right information", async function () {
    const Site = await ethers.getContractFactory("NminSite");
    const site = await Site.deploy();
    await site.deployed();

    const tx = await site.newWebsite(nftName, symbol, coverURL, title, content);
    const newWebsite = await tx.wait();

    const {
      addr,
      title: getTitle,
      content: getContent,
      coverURL: getCoverUrl,
    } = await site.websites(0);

    expect(getTitle).to.equal(title);
    expect(content).to.equal(getContent);
    expect(coverURL).to.equal(getCoverUrl);

    const event = newWebsite.events?.filter((x) => x.event === "NewWebsite")[0];
    const webSiteAddr = event?.args?.newAddress;

    expect(webSiteAddr).to.equal(addr);
  });
  it("Should set right information", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    console.table([owner.address, addr1.address, addr2.address]);

    const Site = await ethers.getContractFactory("NminSite");
    const site = await Site.connect(owner).deploy();
    await site.deployed();

    const tx = await site.newWebsite(nftName, symbol, coverURL, title, content);
    const newWebsite = await tx.wait();

    const event = newWebsite.events?.filter((x) => x.event === "NewWebsite")[0];
    const webSiteAddr = event?.args?.newAddress;

    const newContract = await ethers.getContractAt("NFToken", webSiteAddr);

    expect(await newContract.owner()).to.equal(owner.address);

    const tx2 = await newContract.connect(addr1).mint();
    await tx2.wait();

    expect(await newContract.balanceOf(addr1.address)).to.equal(1);
    expect(await newContract.ownerOf(0)).to.equal(addr1.address);
  });
});
