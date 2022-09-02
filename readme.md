## Prehistoric Involution

![Test Passing](https://github.com/Aperocky/prehistoric-simulation/workflows/Unit%20Tests/badge.svg)

This is a simulator in browser, with a full REPL to control and get the data from the simulation.

Check it out: http://prehistoric.tech

![Example Interface](/sample/overall.png)

this uses npm package [market-transactions-engine](https://www.npmjs.com/package/market-transactions-engine) to power its market.

### How it works

The simulation are based on randomly generated terrain, where prehistoric people and households live and multiply. They exchange goods through markets, and occasionally congregates in cities and metropolitan locations. Eventually, Malthusian traps set in and market condition degrade...

Thousands of family could exist in this space, and you can get the information from each of them.

`help` will walk you through all available repl commands.

`run` will progress the simulation by 1 year, `run 10` will progress it by 10 years.

`market` will display the current global market.

When you hover over the map, display commands are automatically inserted in the repl so you only have to hit return to see the output.

when displaying towns or people in the same family, lists offer ability to quickly navigate, e.g. `mem 1` will automatically generate the command seen below:

![Mem Command Demo](/sample/mem.png)

And of course, this simulation offers different display mode so that the map don't bore you out, individual families can be displayed in the early game, but you can shift to city and other more general display mode when population expands:

    console$ mode --help
    change display mode
    mode default: default display mode
    mode density: population density
    mode health: population health
    mode city: display cities
    mode age: display average age

all command will accept `--help` to show you all the params. Have fun exploring!

### More features envisioned:

1. City states, warfare and citizenship.
2. Different type of governance.
3. Personality and other personal traits - to affect job conversion and others.
