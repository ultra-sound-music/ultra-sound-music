use the resources in the "core" folder for communicating from components into into more complex redux resources that cross domain boundaries.

Ex:

The `getOwnedArtists` selector requires knowledge of the current account address, which is found in the web3 domain but also requires knowledge of the artist tokens, which is found in the usm domain.

@TODO - It may make sense to do away with the "core" domain and instead just use the "mediator" domain. For the example shown above this would mean moving the selector into the usm domain (because arguably, the primary noun here is "artists" which are a concept of the usm domain) and then linking over to the web3 domain via the mediator.
