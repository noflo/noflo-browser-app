noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component

  # Define a meaningful icon for component from http://fontawesome.io/icons/
  c.icon = 'cog'

  # Provide a description on component usage
  c.description = 'do X'

  # Add input ports
  c.inPorts.add 'in',
    datatype: 'string'

  # Add output ports
  c.outPorts.add 'out',
    datatype: 'string'

  # What to do when port receives a packet
  c.process (input, output) ->
    # Check that input has received data packet
    return unless input.hasData 'in'
    # Read the contents of the data packet
    data = input.getData 'in'
    # Send the contents to output port
    output.send
      out: data
    # Finish processing
    output.done()
