# What is this?

This is a secret santa / gift exchange drawing. It will take in a list of participants as well as any previous years pairings or family members and work to give everyone a unique pairing every year.

# How does it work

It has an input of a csv file that contain a few rows. The first column in each row is used to identify the data in the column and is not actual data.
- row 1 - this is the list of participants
- family rows - these are list of famiily members that should not be paired with the participant. It is no fun having people in your immediate family for a figt exchange
- previous years - these are the pairings from previous years. The program won't let a duplicate pairing happen

It is written using nodejs. To run from command line you can follow the instructions below.

1) Install nodejs
2) run `npm install` in the project directory
3) run `npm

# Future improvements

- Turn the command line logic into APIs
- Add a front end