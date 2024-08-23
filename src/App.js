
import './App.css';
import Heading from './components/heading';
import Alerts from './components/alerts';
import CurrentWeather from './components/weather';

function App() {
  return (
    <main>
    <Heading text="Neo Weather" color='purple'/>
    <CurrentWeather/>
    <Alerts/>
    </main>
  );
}

export default App;
