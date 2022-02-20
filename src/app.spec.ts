import { mount } from '@vue/test-utils'
import TrafficLightVue from './components/TrafficLight.vue'

it('Renders without crash', () => {
    const wrapper = mount(TrafficLightVue)
    expect(wrapper.text()).toMatchInlineSnapshot()
    expect(wrapper.html()).toMatchInlineSnapshot()
})
