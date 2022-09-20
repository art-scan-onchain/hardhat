const { expect } = require("chai");
const { ethers } = require("hardhat");
const { v4 } = require('uuid');

const log = console.log

describe("Greeter", function () {
  let deployer, operator, viewer;
  let artContract;

  beforeEach(async() => {

    [deployer, operator, viewer] = await ethers.getSigners()
    const ArtThenticator   = await ethers.getContractFactory("ArtThenticator");
    artContract = await ArtThenticator.deploy();
    await artContract.deployed();
  })

  it("Should set operator", async function () {
    await artContract.setOperator(operator.address)
    expect(await artContract.operator()).to.eq(operator.address)
  });

  it("Should add art", async function () {
    await artContract.setOperator(operator.address)
    expect(await artContract.operator()).to.eq(operator.address)

    const newArtUUID = v4()

    await artContract.connect(operator).addArt(newArtUUID, "name", "medium", "coa", 1657023454306)

    const [ _id, _uuid, _name, _medium ] = await artContract.connect(operator).getIdByUUID(newArtUUID)
    // const [ _id, _uuid, _name, _medium ] = await artContract.lastAddition()
    expect(_id.toString()).to.eq("1")
    expect(_name).to.eq("name")
    console.log('uuid is', _uuid)
    expect(_medium).to.eq("medium")
  });

  it("Should modify art", async function () {
    await artContract.setOperator(operator.address)
    expect(await artContract.operator()).to.eq(operator.address)
    const newArtUUID = v4()
    const modifiedUUID = v4()

    await artContract.connect(operator).addArt(newArtUUID, "name", "medium", "coa", 1657023454306)

    const [ _id, ] = await artContract.connect(operator).getIdByUUID(newArtUUID)
 
    await artContract.connect(operator).modifyArt(_id.toString(), modifiedUUID, "name3", "medium3", "coa3", 1657023454306)

    const _idGetByUUID_OLD =await artContract.connect(viewer).getIdByUUID(newArtUUID)
    const _idGetByUUID_NEW =await artContract.connect(viewer).getIdByUUID(modifiedUUID)
    log('_idGetByUUID_OLD', _idGetByUUID_OLD[0], _idGetByUUID_OLD[1], _idGetByUUID_OLD[2])
    log('_idGetByUUID_NEW', _idGetByUUID_NEW[0], _idGetByUUID_NEW[1], _idGetByUUID_NEW[2])


    const [_, __, modName, modMedium, modCoa ] = await artContract.connect(operator).getById(1)

    expect(modName).to.eq("name3")
    expect(modMedium).to.eq("medium3")
    expect(modCoa).to.eq("coa3")
  });
});
