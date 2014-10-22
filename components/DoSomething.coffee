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
    process: (event, payload) ->
      # What to do when port receives a packet
      return unless event is 'data'
      c.outPorts.out.send payload

  # Add output ports
  c.outPorts.add 'out',
    datatype: 'string'

  # Finally return the component instance
  c
