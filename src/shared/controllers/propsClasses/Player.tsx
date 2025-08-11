// classes.tsx
import { Expose } from '@Inspector/meta/decorators';
import React from 'react';

export class Player {
  @Expose()
  name: string = 'Player1';

  @Expose()
  health: number = 100;

  @Expose({
    params: [
      { name: 'damage', type: 'number' },
      { name: 'critical', type: 'boolean' },
    ],
  })
  takeDamage(damage: number, critical: boolean) {
    this.health -= critical ? damage * 2 : damage;
    console.log(`${this.name} took ${critical ? 'CRITICAL' : ''} damage! HP=${this.health}`);
  }

  @Expose({
    render: (instance) => (
      <div style={{ background: '#2d2d2dff', padding: '4px', marginTop: '4px' }}>
        <strong>HP Bar:</strong>
        <div
          style={{
            width: '100%',
            background: '#3a3a3aff',
            height: '10px',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              width: `${instance.health}%`,
              background: 'green',
              height: '10px',
            }}
          ></div>
        </div>
      </div>
    ),
  })
  hpBar: null = null;
}
