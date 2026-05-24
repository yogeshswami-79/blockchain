// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Counter} from "./Counter.sol";
import {Test} from "forge-std/Test.sol";

contract CounterTest is Test {
    Counter counter;

    function setUp() public {
        counter = new Counter();
    }

    function test_InitialValue() public view {
        require(counter.count() == 0, "Initial value should be 0");
    }

    function testFuzz_Increment(uint8 times) public {
        for (uint8 i = 0; i < times; i++) {
            counter.increment();
        }
        require(counter.count() == times, "Count should equal number of increments");
    }

    function test_DecrementRevertsAtZero() public {
        vm.expectRevert();
        counter.decrement();
    }

    function test_Reset() public {
        counter.increment();
        counter.increment();
        counter.reset();
        require(counter.count() == 0, "Count should be 0 after reset");
    }
}
