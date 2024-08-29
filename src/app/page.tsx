import styles from './page.module.css'
import Canvas from '../components/Canvas/index';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Drawing App</h1>
      <Canvas />
    </main>
  );
}

