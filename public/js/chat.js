const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormInput = $messageForm.querySelector('input')
const $locationShareButton = document.querySelector('#share-location')
const $message = document.querySelector('#message')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username,room } = Qs.parse(location.search,{ ignoreQueryPrefix: true})

const autoScroll = () => {
    const $newMessage = $message.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    const visibleHeight = $message.offsetHeight
    const containerHeight = $message.scrollHeight
    const scrollOffset = $message.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $message.scrollTop = $message.scrollHeight
    }
}




socket.on('display',(message)=>{
    console.log(message.text)
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('display-Location',(locationLink)=>{
    console.log(locationLink.url)
    const html = Mustache.render(locationTemplate,{
        username : locationLink.username,
        locationLink : locationLink.url,
        createdAt : moment(locationLink.createdAt).format('h:mm a')

    })
    $message.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',({room,users}) => {

  const html = Mustache.render(sidebarTemplate,{
    room,
    users 
  })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value

    socket.emit('message',message,(error)=>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Delivered!-client')
    });
})

$locationShareButton.addEventListener('click',()=>{
    $locationShareButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('send-location',{latitude : position.coords.latitude,longitude : position.coords.longitude },(error)=>{
            $locationShareButton.removeAttribute('disabled')
            if(error){
                return console.log(error)
            }
            console.log('Location Shared-client')
        })
    })
})


socket.emit('join',{ username,room },(error) => {
    if(error){
        alert(error)
        location.href='/'
    }
})