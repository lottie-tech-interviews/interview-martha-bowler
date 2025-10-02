# exercise 1:
create a /welcome endpoint that returns a welcome message. Takes a parameter name and returns a welcome message with the name.
The implementation should be broken and always return "Hello Alice & Bob". The test should not pass.

# exercise 2:
The endpoint is fetching 2 CSV files (stored locally) that contains this data:

carehome_data.csv:
id;name;description

homecare_data.csv:
id;name;description

The files are not sorted by id.

The endpoint needs to download the 2 files on demand, and search for the provided id, and return the data.

generate the 2 files with a script so that we don't store them in the repo. Make sure the id do not overlap.






